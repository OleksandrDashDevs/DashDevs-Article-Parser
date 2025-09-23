import { ToastContainer, Bounce } from "react-toastify";

export const ToastMessage = () => {
    return (
        <ToastContainer
            position='top-center'
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='colored'
            transition={Bounce}
        />
    );
};
