interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='w-full max-w-md'>
                {children}
            </div>
        </div>
    );
};

export default Layout;