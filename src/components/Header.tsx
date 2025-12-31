import { SiTelegram } from 'react-icons/si';

const Header = () => {
  return (
    <header className="bg-tg-secondary-bg border-b border-gray-700 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <SiTelegram className="text-3xl text-tg-primary" />
            <h1 className="text-xl font-semibold text-tg-text tracking-wider">
              Heap Master Pro
            </h1>
          </div>
          <div className="text-xs text-tg-secondary-text">
            Next-Gen Heap Leach Pad Design
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;