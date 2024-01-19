// import { createContext, useState } from "react";

// const UserContext = createContext({} as any);

// function UserProvider({ children }: any) {
//     const [user, setUser] = useState([] as any);

//     const setUserContext = (value: any) => {
//         setUser(value);
//     }
    
//     return (
//         <UserContext.Provider value={{ user, setUserContext }}>
//             {children}
//         </UserContext.Provider>
//     );
// }

// export { UserContext, UserProvider };