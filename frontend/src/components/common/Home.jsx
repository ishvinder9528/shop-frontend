import { Button } from "../ui/button";
import { useNavigate } from "react-router";

const Home = () => {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center mx-26  gap-3">
      <div className="border bg-[#ebd5c4] mt-5 w-[90%] rounded-xl ">
        <img src="/home.svg" className="h-[350px] w-full mt-16" />
      </div>
      <h2 className="font-bold text-2xl text-[#5ba698] text-center">
        GURUKIRPA COLLECTION
        <br/>
        <span className="font-bold text-xl text-gray-500">Ledger | E-Commerce | Bills</span>
      </h2>
      <Button onClick={()=>navigate('/create-shop')} 
        className='my-3'>Get Started. It&apos;s Free</Button>
    </div>
  );
};

export default Home;
