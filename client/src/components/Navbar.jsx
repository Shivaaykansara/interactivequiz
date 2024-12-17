import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <>
        <div className="text-center  bg-gray-700 text-white p-4">
            <Link to={'/'}><h1 className="font-bold italic text-4xl">Interactive Quiz</h1></Link>
            <div className="flex items-center justify-center gap-5 p-4 font-semibold">
                <Link to={'/create-test'}>Create Test</Link>
                <Link to={'/take-test'}>Give Test</Link>
            </div>
        </div>
    </>
  );
};

export default Navbar;