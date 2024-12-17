import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div>
      <div className="sm:flex items-center justify-center gap-5 h-[30vw]">
        <Link to={"/create-test"}>
          <div className="bg-slate-700 rounded-3xl p-20 text-center border-2 border-black text-white">
            Create Test
          </div>
        </Link>
        <Link to={"/take-test"}>
          <div className="bg-slate-700 rounded-3xl p-20 text-center border-2 border-black text-white">
            Give Test
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
