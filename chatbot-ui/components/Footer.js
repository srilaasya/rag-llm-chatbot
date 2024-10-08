const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full py-4 bg-transparent text-white text-center z-50">
            <p className="text-sm">
                Made with ♥ by{' '}
                <a
                    href="https://www.linkedin.com/in/sri-laasya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                >
                    Sri Laasya Nutheti
                </a>
                . If you're a founder of an early-stage AI startup looking to hire, I'd love to chat!
            </p>
        </footer>
    );
};

export default Footer;