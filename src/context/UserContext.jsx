/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "يوسف أحمد",
    avatar: "https://i.pravatar.cc/150?u=youssef",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// بدلاً من تصديرها كـ const، جرب تصديرها كدالة عادية إذا استمر الخطأ، 
// أو يمكنك ببساطة تجاهل التحذير لأنه لا يؤثر على تشغيل الكود فعلياً.
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}