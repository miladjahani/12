// ... (Pad and View3D classes)

class App {
    // ... (constructor)
    init() {
        document.getElementById('openModalBtn').addEventListener('click', () => {
            document.getElementById('modal3D').classList.add('open');
            if (!this.view3D.renderer) {
                this.view3D.init('canvas-wrapper');
                this.pads.forEach(p => this.view3D.addPad(p));
            }
        });

        document.getElementById('closeModalBtn').addEventListener('click', () => {
            document.getElementById('modal3D').classList.remove('open');
        });

        this.bindEventListeners();
        this.createInitialPad();
    }
    // ... (rest of the class)
}

// ... (DOM Content Loaded)
