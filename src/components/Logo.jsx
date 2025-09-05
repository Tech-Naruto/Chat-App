import logo from "../assets/Logo.png";

function Logo({width = "w-12"}) {
    return (
        <div className="p-2">
            <img src={logo} alt="Logo" className={`${width}`} />
        </div>
    );
}

export default Logo;