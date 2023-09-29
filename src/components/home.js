import React, {useState, useEffect, useRef} from "react";

const Home = () => {

    const node = useRef();
    const [searchInput, setSearchInput] = useState("");
    const [users, setUsers] = useState([]);
    const [suggest, setSuggest] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    useEffect(() => {
      const handleClick =(e) => {
          if (node.current && node.current.contains(e.target)) {
            return;
          }
          setSuggest(false);
      }
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("mousedown", handleClick);
    };
}, []);


    const option = {
      method: 'GET',
      headers: {
          'Ocp-Apim-Subscription-Key': "", //Your Bing API goes here
      }
  };
    const fetchData = () => {
      const query = searchInput;
      fetch(`https://api.bing.microsoft.com/v7.0/suggestions?q=${query}`, option)
      .then(response => response.json())
      .then(values => {
        setUsers(values);
    });
    };

    useEffect(() => {
        fetchData();
    }, [searchInput]);

    useEffect(() => {
        console.log(users);
    }, [users]);

    return(
        <>
        <div className="flex justify-center mt-12">
            <p className="text-blue-600 text-lg font-medium">My autossugestions from Bing API</p>
        </div>
        <div className="flex justify-center mt-12"  ref={node}>
            <input
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            setSelectedSuggestionIndex(-1);
                            setSuggest(true);
                          }}
            className="w-4/5 sm:w-1/3 p-2 rounded outline-none border border-blue-600 text-gray-600 font-medium"/>
        </div>
        <div className="flex justify-center">
        {(suggest ? users.suggestionGroups ?? [] : []).map((result, index) => {
  return (
    <ul className='border-2 w-4/5 pt-3 sm:w-1/3 border-white top-14 left-0 z-20 bg-white rounded-b-lg' key={index}>
      {result.searchSuggestions.map((r, suggestionIndex) => (
        <li
          className={`flex items-center my-1 bg-white font-semibold text-gray-600 cursor-pointer hover:text-blue-600 ${
            suggestionIndex === selectedSuggestionIndex && 'bg-gray-200 py-1 border-x-2 border-gray-200'
          }`}
          key={suggestionIndex}
        >
          <span className='mr-2'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400 cursor-pointer sm:hidden"
              viewBox="0 0 20 20"
              fill="currentColor"
              onClick={(e) => {
                e.stopPropagation();
                setSearchInput(r.displayText);
              }}
            >
              <path
                fillRule="evenodd"
                d="M15.5 14h-.79l-.28-.27c1.06-1.25 1.67-2.82 1.67-4.46 0-3.9-3.1-7-7-7s-7 3.1-7 7 3.1 7 7 7c1.64 0 3.17-.58 4.38-1.55l.27.28v.79l4.25 4.25c.19.19.45.3.72.3s.53-.11.72-.3c.4-.4.4-1.03 0-1.42L15.5 14zm-7 0c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span>{r.displayText}</span>
        </li>
      ))}
    </ul>
  );
})}
        </div>
        </>
    )
}

export default Home;