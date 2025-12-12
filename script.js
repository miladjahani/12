// --- CORE APP LOGIC ---
const App = {
    pads: [],
    selectedId: null,
    terrain: { sx: -2, sy: 1 },
    init() {
        // Check for saved theme
        const savedTheme = localStorage.getItem('heapMasterTheme');
        if(savedTheme === 'light') {
            document.body.classList.remove('dark-mode');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.add('dark-mode');
            document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        }

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            localStorage.setItem('heapMasterTheme', isDarkMode ? 'dark' : 'light');
            document.getElementById('themeToggle').innerHTML = isDarkMode ?
                '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            View3D.updateTheme();
        });

        // Mobile menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('open');
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
            });
        });

        // Initialize inputs listeners
        const inputs = ['inpName','inpL','inpW','inpH','inpX','inpZ','inpLat','inpEmit','inpIrrRate','inpSlopeDeg','inpGrade','inpRec','inpDens'];
        inputs.forEach(id => document.getElementById(id).addEventListener('input', () => this.updateFromDOM()));
        const selects = ['bTypeL', 'bTypeR', 'bTypeF', 'bTypeB'];
        selects.forEach(id => document.getElementById(id).addEventListener('change', () => this.updateFromDOM()));

        // Load terrain inputs
        document.getElementById('inpSx').value = this.terrain.sx;
        document.getElementById('inpSy').value = this.terrain.sy;

        // Initial Pad
        this.createPad({
            x:0, z:0, L:200, W:100, H:15, lift:1,
            slopeDeg: 37,
            grade: 0.7,
            rec: 80,
            dens: 1.7,
            irrRate: 80,
            lat: 50,
            emit: 40
        });

        View3D.init();
    },
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        document.getElementById('toast-message').textContent = message;
        toast.className = 'toast show ' + type;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },
    createPad(props) {
        const id = `pad_${Date.now()}`;
        const p = {
            id: id,
            name: props.name || `پد ${this.pads.length + 1}`,
            x: props.x, z: props.z,
            L: props.L, W: props.W, H: props.H,
            lift: props.lift,
            slopeDeg: props.slopeDeg || 37,
            bounds: {
                L: props.bounds?.L || 'free', R: props.bounds?.R || 'free',
                F: props.bounds?.F || 'free', B: props.bounds?.B || 'free'
            },
            lat: props.lat || 50,
            emit: props.emit || 40,
            irrRate: props.irrRate || 80,
            grade: props.grade || 0.7,
            rec: props.rec || 80,
            dens: props.dens || 1.7
        };
        this.pads.push(p);
        this.renderPadSelect();
        this.selectPad(id);

        View3D.addPad(p);

        const padSelect = document.getElementById('padSelect');
        padSelect.classList.add('pulse');
        setTimeout(() => padSelect.classList.remove('pulse'), 500);

        this.showToast(`پد "${p.name}" با موفقیت ایجاد شد`);
    },
    addPad(mode) {
        if(!this.selectedId) return;
        const ref = this.pads.find(p => p.id === this.selectedId);

        let props = { ...ref, name: `${ref.name} (کپی)` };

        switch(mode) {
            case 'right':
                props.x = ref.x + ref.L;
                props.z = ref.z;
                props.lift = ref.lift;
                props.bounds.L = 'attach';
                ref.bounds.R = 'attach';
                break;
            case 'front':
                props.x = ref.x;
                props.z = ref.z + ref.W;
                props.lift = ref.lift;
                props.bounds.B = 'attach';
                ref.bounds.F = 'attach';
                break;
            case 'top':
                props.x = ref.x;
                props.z = ref.z;
                props.lift = ref.lift + 1;
                props.name = `طبقه ${props.lift} - ${ref.name}`;
                break;
        }

        this.createPad(props);
        this.updatePad(ref); // Update the reference pad's boundaries
    },
    deletePad() {
        if(this.pads.length <= 1) {
            this.showToast('حداقل یک پد باید وجود داشته باشد', 'error');
            return;
        }
        if(!this.selectedId || !confirm("آیا مطمئن هستید که می‌خواهید این پد را حذف کنید؟")) return;

        const padIdToDelete = this.selectedId;
        const padToDelete = this.pads.find(p => p.id === padIdToDelete);
        const padName = padToDelete.name;

        // Update boundaries of adjacent pads
        const adjacent = this.getAdjacentPads(padToDelete);
        if(adjacent.left) adjacent.left.bounds.R = 'free';
        if(adjacent.right) adjacent.right.bounds.L = 'free';
        if(adjacent.front) adjacent.front.bounds.B = 'free';
        if(adjacent.back) adjacent.back.bounds.F = 'free';

        // Remove from data array
        this.pads = this.pads.filter(p => p.id !== padIdToDelete);

        // Remove from 3D view
        View3D.removePad(padIdToDelete);

        // Update adjacent pads in 3D view
        Object.values(adjacent).forEach(pad => {
            if (pad) this.updatePad(pad);
        });

        this.renderPadSelect();

        // Select the last available pad
        const newSelectionId = this.pads.length > 0 ? this.pads[this.pads.length - 1].id : null;
        this.selectPad(newSelectionId);

        this.showToast(`پد "${padName}" با موفقیت حذف شد`);
    },
    selectPad(id) {
        if (!id && this.pads.length > 0) {
            id = this.pads[0].id;
        }
        if (!id) return;

        this.selectedId = id;
        const p = this.pads.find(x => x.id === id);
        if(!p) return;

        const set = (k, v) => document.getElementById(k).value = v;
        set('inpName', p.name);
        set('inpL', p.L); set('inpW', p.W); set('inpH', p.H);
        set('inpX', p.x); set('inpZ', p.z);
        set('inpLift', p.lift);
        set('inpLat', p.lat); set('inpEmit', p.emit);
        set('inpIrrRate', p.irrRate);
        set('inpSlopeDeg', p.slopeDeg);
        set('inpGrade', p.grade); set('inpRec', p.rec); set('inpDens', p.dens);
        set('bTypeL', p.bounds.L); set('bTypeR', p.bounds.R);
        set('bTypeF', p.bounds.F); set('bTypeB', p.bounds.B);

        const sel = document.getElementById('padSelect');
        if (sel) sel.value = id;

        View3D.highlightPad(id);
        this.calculateResults();
    },
    updatePad(pad) {
        const p = this.pads.find(item => item.id === pad.id);
        if (!p) return;
        Object.assign(p, pad);
        this.renderPadSelect();
        View3D.updatePad(p);

        // Also update adjacent pads as their geometry might be affected
        const adjacent = this.getAdjacentPads(p);
        Object.values(adjacent).forEach(adjPad => {
            if (adjPad) View3D.updatePad(adjPad);
        });
    },
    calculateResults() {
        if (!this.selectedId) return;
        const btn = document.getElementById('calculateBtn');
        btn.classList.add('loading');
        // Simulate a delay for calculation
        setTimeout(() => {
            this.calcStats();
            this.showToast("نتایج محاسبه شدند", "success");
            btn.classList.remove('loading');
        }, 500);
    },
    renderPadSelect() {
        const sel = document.getElementById('padSelect');
        sel.innerHTML = '';
        this.pads.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.text = `[${p.lift}] ${p.name} (${p.L}×${p.W}×${p.H}m)`;
            sel.appendChild(opt);
        });
        sel.value = this.selectedId;
    },
    updateFromDOM() {
        if(!this.selectedId) return;
        const p = this.pads.find(x => x.id === this.selectedId);
        const get = (k) => document.getElementById(k).value;
        const num = (k) => parseFloat(get(k)) || 0;

        p.name = get('inpName');
        p.L = num('inpL'); p.W = num('inpW'); p.H = num('inpH');
        p.x = num('inpX'); p.z = num('inpZ');
        p.lat = num('inpLat'); p.emit = num('inpEmit');
        p.irrRate = num('inpIrrRate');
        p.slopeDeg = num('inpSlopeDeg');
        p.grade = num('inpGrade'); p.rec = num('inpRec'); p.dens = num('inpDens');
        p.bounds.L = get('bTypeL'); p.bounds.R = get('bTypeR');
        p.bounds.F = get('bTypeF'); p.bounds.B = get('bTypeB');

        this.updatePad(p);
    },
    updateGlobalSlope() {
        this.terrain.sx = parseFloat(document.getElementById('inpSx').value) || 0;
        this.terrain.sy = parseFloat(document.getElementById('inpSy').value) || 0;
        View3D.updateGround();
        this.pads.forEach(p => View3D.updatePad(p));
    },
    getAdjacentPads(pad) {
        const epsilon = 0.1; // Tolerance for floating point comparisons
        return {
            left: this.pads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.x + p.L - pad.x) < epsilon && Math.abs(p.z - pad.z) < epsilon),
            right: this.pads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.x - (pad.x + pad.L)) < epsilon && Math.abs(p.z - pad.z) < epsilon),
            front: this.pads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.z - (pad.z + pad.W)) < epsilon && Math.abs(p.x - pad.x) < epsilon),
            back: this.pads.find(p => p.id !== pad.id && p.lift === pad.lift && Math.abs(p.z + p.W - pad.z) < epsilon && Math.abs(p.x - pad.x) < epsilon),
        };
    },
    calcStats() {
        if(!this.selectedId) return;
        const p = this.pads.find(x => x.id == this.selectedId);
        if(!p) return;

        const adjacent = this.getAdjacentPads(p);
        const H_avg = p.H;
        const slope_deg = p.slopeDeg;
        const L = p.L; const W = p.W;
        const sx = this.terrain.sx / 100; const sy = this.terrain.sy / 100;
        const dens = p.dens; const grade = p.grade / 100; const rec = p.rec / 100;
        const irrRate = p.irrRate; const latSpace = p.lat / 100; const emitSpace = p.emit / 100;

        const slope_ratio = 1 / Math.tan(slope_deg * Math.PI / 180);

        const getGroundY = (x, z) => (x + p.x) * sx + (z + p.z) * sy;

        const hTL = H_avg - getGroundY(-L/2, -W/2);
        const hTR = H_avg - getGroundY(L/2, -W/2);
        const hBR = H_avg - getGroundY(L/2, W/2);
        const hBL = H_avg - getGroundY(-L/2, W/2);

        const getRun = (h, type, adj) => (type === 'wall') ? 0 : h * slope_ratio * (type === 'attach' && adj ? 0.5 : 1);

        const runL = getRun((hTL + hBL)/2, p.bounds.L, adjacent.left);
        const runR = getRun((hTR + hBR)/2, p.bounds.R, adjacent.right);
        const runF = getRun((hBR + hBL)/2, p.bounds.F, adjacent.front);
        const runB = getRun((hTR + hTL)/2, p.bounds.B, adjacent.back);

        let topL = Math.max(0, L - (runL + runR));
        let topW = Math.max(0, W - (runF + runB));

        const baseArea = L * W;
        const topArea = topL * topW;
        const midArea = ((L + topL) / 2) * ((W + topW) / 2);
        const vol = (H_avg / 6) * (baseArea + topArea + 4 * midArea);
        const mass = vol * dens;
        const cu = mass * grade * rec;
        const acid = mass * 0.015;

        const numLat = latSpace > 0 ? Math.floor(topL / latSpace) : 0;
        const latLen = numLat * topW;
        const emitCount = emitSpace > 0 ? Math.floor(latLen / emitSpace) : 0;
        const flow_m3_hr = (emitCount * irrRate * 60) / 1000000;
        const pipeLen = topL + latLen;

        const dist = (dx, dz, dy) => Math.sqrt(dx*dx + dz*dz + dy*dy);
        const hipFL = dist(runL, runF, hBL);
        const hipFR = dist(runR, runF, hBR);
        const hipBL = dist(runL, runB, hTL);
        const hipBR = dist(runR, runB, hTR);

        const f = n => n.toLocaleString('fa-IR', { maximumFractionDigits: 0 });
        const f2 = n => n.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        document.getElementById('resCu').innerText = f2(cu);
        document.getElementById('resVol').innerText = f(vol);
        document.getElementById('resAcid').innerText = f(acid);
        document.getElementById('resFlow').innerText = f2(flow_m3_hr);

        document.getElementById('tblMass').innerText = `${f(mass)} تن`;
        document.getElementById('tblBaseArea').innerText = `${f(baseArea)} متر مربع`;
        document.getElementById('tblTopArea').innerText = `${f(topArea)} متر مربع`;
        document.getElementById('tblTopDims').innerText = `${f2(topL)} × ${f2(topW)} متر`;
        document.getElementById('tblEmit').innerText = `${f(emitCount)} عدد`;

        document.getElementById('resH_FL').innerText = `${f2(hBL)} متر`;
        document.getElementById('resH_FR').innerText = `${f2(hBR)} متر`;
        document.getElementById('resH_BL').innerText = `${f2(hTL)} متر`;
        document.getElementById('resH_BR').innerText = `${f2(hTR)} متر`;

        document.getElementById('resHip_FL').innerText = `${f2(hipFL)} متر`;
        document.getElementById('resHip_FR').innerText = `${f2(hipFR)} متر`;
        document.getElementById('resHip_BL').innerText = `${f2(hipBL)} متر`;
        document.getElementById('resHip_BR').innerText = `${f2(hipBR)} متر`;

        document.getElementById('corner-FL').innerText = `${f2(hBL)} متر`;
        document.getElementById('corner-FR').innerText = `${f2(hBR)} متر`;
        document.getElementById('corner-BL').innerText = `${f2(hTL)} متر`;
        document.getElementById('corner-BR').innerText = `${f2(hTR)} متر`;

        document.getElementById('tblMassTech').innerText = `${f(mass)} تن`;
        document.getElementById('tblVol').innerText = `${f(vol)} متر مکعب`;
        document.getElementById('tblCu').innerText = `${f2(cu)} تن`;
        document.getElementById('tblAcid').innerText = `${f(acid)} تن`;
        document.getElementById('tblGrade').innerText = `${p.grade}%`;
        document.getElementById('tblRec').innerText = `${p.rec}%`;
        document.getElementById('tblDens').innerText = `${p.dens} تن/متر مکعب`;

        document.getElementById('tblFlow').innerText = `${f2(flow_m3_hr)} متر مکعب/ساعت`;
        document.getElementById('tblEmitterCount').innerText = `${f(emitCount)} عدد`;
        document.getElementById('tblCol').innerText = `${f(topL)} متر`;
        document.getElementById('tblLat').innerText = `${f(latLen)} متر`;
        document.getElementById('tblPipe').innerText = `${f(pipeLen)} متر`;
        document.getElementById('tblLatSpace').innerText = `${p.lat} سانتی‌متر`;
        document.getElementById('tblEmitSpace').innerText = `${p.emit} سانتی‌متر`;
        document.getElementById('tblIrrRate').innerText = `${p.irrRate} میلی‌لیتر/دقیقه`;
    },
    exportToPDF() {
        const btn = document.getElementById('pdfExportBtn');
        btn.classList.add('loading');

        const content = document.querySelector('.main-content');

        html2canvas(content, {
            scale: 2,
            useCORS: true,
            backgroundColor: document.body.classList.contains('dark-mode') ? '#0f172a' : '#f8fafc'
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const width = pdfWidth;
            const height = width / ratio;

            pdf.addImage(imgData, 'PNG', 0, 0, width, height > pdfHeight ? pdfHeight : height);
            pdf.save("HeapMaster-Report.pdf");

            this.showToast("فایل PDF با موفقیت ایجاد شد.", "success");
        }).catch(err => {
            console.error("Error generating PDF:", err);
            this.showToast("خطا در ایجاد فایل PDF.", "error");
        }).finally(() => {
            btn.classList.remove('loading');
        });
    }
};

// --- 3D ENGINE ---
const View3D = {
    scene: null, camera: null, renderer: null, controls: null,
    padMeshes: new Map(), groundMesh: null,
    isWireframe: false, showLabels: false, isOpen: false,
    init() {
        const cont = document.getElementById('canvas-wrapper');
        const w = cont.clientWidth; const h = cont.clientHeight;

        this.scene = new THREE.Scene();
        this.updateTheme();

        this.camera = new THREE.PerspectiveCamera(45, w/h, 1, 5000);
        this.camera.position.set(300, 250, 400);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        cont.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const dl = new THREE.DirectionalLight(0xffffff, 0.8);
        dl.position.set(200, 500, 200);
        this.scene.add(dl);

        this.addGroundGrid();

        window.addEventListener('resize', () => this.updateRendererSize());
    },
    addPad(pad) {
        const group = new THREE.Group();

        const oreMaterial = new THREE.MeshStandardMaterial({ roughness: 0.9 });
        const oreMesh = new THREE.Mesh(new THREE.BufferGeometry(), oreMaterial);
        oreMesh.name = "ore";

        const pipeMaterial = new THREE.LineBasicMaterial({ linewidth: 2 });
        const pipeMesh = new THREE.LineSegments(new THREE.BufferGeometry(), pipeMaterial);
        pipeMesh.name = "pipe";

        group.add(oreMesh, pipeMesh);
        this.scene.add(group);
        this.padMeshes.set(pad.id, group);

        this.updatePad(pad);
    },
    updatePad(pad) {
        const group = this.padMeshes.get(pad.id);
        if (!group) return;

        const oreMesh = group.getObjectByName("ore");
        const pipeMesh = group.getObjectByName("pipe");

        // Update ore material
        oreMesh.material.color.set(document.getElementById('colOre').value);
        if(pad.lift > 1) oreMesh.material.color.offsetHSL(0, 0, -0.1 * (pad.lift-1));
        oreMesh.material.wireframe = this.isWireframe;

        // Update pipe material
        pipeMesh.material.color.set(document.getElementById('colPipe').value);

        // Update Geometry
        const { oreVertices, pipeVertices } = this.generatePadGeometry(pad);
        oreMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(oreVertices), 3));
        oreMesh.geometry.computeVertexNormals();

        pipeMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(pipeVertices), 3));
    },
    removePad(padId) {
        if (this.padMeshes.has(padId)) {
            const group = this.padMeshes.get(padId);
            this.scene.remove(group);
            // Dispose geometries and materials
            group.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
            this.padMeshes.delete(padId);
        }
    },
    generatePadGeometry(p) {
        const sx = App.terrain.sx / 100; const sy = App.terrain.sy / 100;
        const getBaseY = (x, z) => (x * sx) + (z * sy) + (p.lift - 1) * p.H;

        const slope_ratio = 1 / Math.tan(p.slopeDeg * Math.PI / 180);
        const adjacent = App.getAdjacentPads(p);

        const c = [{x:-p.L/2, z:-p.W/2}, {x:p.L/2, z:-p.W/2}, {x:p.L/2, z:p.W/2}, {x:-p.L/2, z:p.W/2}];
        const h = c.map(pt => p.H - (pt.x*sx + pt.z*sy));

        const getRun = (h, type, adj) => (type === 'wall') ? 0 : h * slope_ratio * (type === 'attach' && adj ? 0.5 : 1);
        const runs = [getRun(h[0],p.bounds.B,adjacent.back), getRun(h[1],p.bounds.B,adjacent.back), getRun(h[2],p.bounds.F,adjacent.front), getRun(h[3],p.bounds.F,adjacent.front)];

        const t = [
            {x: c[0].x + getRun(h[0], p.bounds.L, adjacent.left), z: c[0].z + runs[0]},
            {x: c[1].x - getRun(h[1], p.bounds.R, adjacent.right), z: c[1].z + runs[1]},
            {x: c[2].x - getRun(h[2], p.bounds.R, adjacent.right), z: c[2].z - runs[2]},
            {x: c[3].x + getRun(h[3], p.bounds.L, adjacent.left), z: c[3].z - runs[3]}
        ];

        const vB = c.map(pt => new THREE.Vector3(p.x+pt.x, getBaseY(p.x+pt.x, p.z+pt.z), p.z+pt.z));
        const vT = t.map(pt => new THREE.Vector3(p.x+pt.x, getBaseY(p.x+pt.x, p.z+pt.z) + p.H, p.z+pt.z));

        const oreVertices = [];
        const sides = [[0, 1, 1, 0], [1, 2, 2, 1], [2, 3, 3, 2], [3, 0, 0, 3]];
        sides.forEach(s => oreVertices.push(
            vB[s[0]].x, vB[s[0]].y, vB[s[0]].z,   vB[s[1]].x, vB[s[1]].y, vB[s[1]].z,   vT[s[2]].x, vT[s[2]].y, vT[s[2]].z,
            vB[s[0]].x, vB[s[0]].y, vB[s[0]].z,   vT[s[2]].x, vT[s[2]].y, vT[s[2]].z,   vT[s[3]].x, vT[s[3]].y, vT[s[3]].z
        ));
        oreVertices.push(vT[0].x, vT[0].y, vT[0].z, vT[1].x, vT[1].y, vT[1].z, vT[2].x, vT[2].y, vT[2].z, vT[0].x, vT[0].y, vT[0].z, vT[2].x, vT[2].y, vT[2].z, vT[3].x, vT[3].y, vT[3].z);

        const pipeVertices = [];
        // Piping generation logic can be added here based on vT...

        return { oreVertices, pipeVertices };
    },
    highlightPad(padId) {
        this.padMeshes.forEach((group, id) => {
            const ore = group.getObjectByName("ore");
            if (ore) {
                ore.material.emissive.set(id === padId ? 0x3333ff : 0x000000);
            }
        });
    },
    updateTheme() {
        const isDark = document.body.classList.contains('dark-mode');
        if (this.scene) this.scene.background = new THREE.Color(isDark ? 0x111827 : 0xf8fafc);
    },
    updateGround() {
        if (!this.groundMesh) return;
        const pos = this.groundMesh.geometry.attributes.position;
        const sx = App.terrain.sx/100; const sy = App.terrain.sy/100;
        for(let i=0; i<pos.count; i++) pos.setZ(i, (pos.getX(i)*sx) + (-pos.getY(i)*sy));
        this.groundMesh.geometry.attributes.position.needsUpdate = true;
        this.groundMesh.geometry.computeVertexNormals();
    },
    addGroundGrid() {
        const geo = new THREE.PlaneGeometry(1000, 1000, 50, 50);
        this.groundMesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x374151, transparent: true, opacity: 0.3 }));
        this.groundMesh.rotation.x = -Math.PI/2;
        this.scene.add(this.groundMesh);
        this.updateGround();
    },
    open() { this.isOpen = true; document.getElementById('modal3D').classList.add('open'); setTimeout(() => this.updateRendererSize(), 100); this.animate(); },
    close() { this.isOpen = false; document.getElementById('modal3D').classList.remove('open'); },
    updateRendererSize() {
        const cont = document.getElementById('canvas-wrapper');
        if (!cont || !this.renderer) return;
        const w = cont.clientWidth; const h = cont.clientHeight;
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    },
    animate() {
        if(!this.isOpen) return;
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());