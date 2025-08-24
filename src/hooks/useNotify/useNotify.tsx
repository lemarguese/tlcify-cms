import toast from "react-hot-toast";
import './useNotify.scss';

export const useNotify = () => {
  return {
    success: (message: string) => toast.success(message, {
      className: 'toast_success'
    }),
    error: (message: string) => toast.error(message, {
      className: 'toast_error'
    }),
    pending: (message: string) => toast.loading(message, {
      className: 'toast_pending'
    }),
    info: (message: string) => toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } toast_info`}
      >
        <div className='toast_info_icon'>
          i
        </div>
        <div className='toast_info_message'>
          {message}
        </div>
      </div>
    ))
  }
}
