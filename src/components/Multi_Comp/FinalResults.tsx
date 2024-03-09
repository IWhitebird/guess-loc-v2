import { FaCrown } from "react-icons/fa";

const Results = ({ results }: any) => {
    console.log("resul", results);
    return (
      <div className="w-full h-full text-center">
        <h1 >Final Results</h1>
        <div className="w-full flex flex-col gap-5 m-2 mt-5">
          {Object.keys(results)?.map((user: any, idx: number) => (
            <div key={idx} className={`w-[80%] mx-auto flex flex-row 
            justify-between gap-5 m-2 text-black border border-black rounded-md ${idx == 0 && 'bg-green-300'}`}>
              
              <p className="m-2 flex justify-center items-center gap-2">
                {idx == 0 && <FaCrown />} {results[user].user_name}</p>
             
              <p className="m-2">{results[user].userPoints}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Results;
  