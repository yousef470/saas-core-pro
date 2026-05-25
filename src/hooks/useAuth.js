export const useAuth = () => {
    // نتحقق من وجود التوكن في الـ LocalStorage (بافتراض أنك تحفظه هناك عند الـ Login)
    const isLoggedIn = !!localStorage.getItem("token"); 

    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return { isLoggedIn, logout };
};