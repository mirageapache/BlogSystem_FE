import { SyntheticEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { useDispatch } from 'react-redux';
// --- components ---
import SignInForm from './SignInForm';
// --- functions / types ---
import { setSignInPop } from '../../redux/loginSlice';

function SignInPopup() {
  const dispatch = useDispatch();
  
  return (
    <div className="fixed z-30 flex justify-center items-center w-screen h-screen">
      <div className="fixed w-screen h-screen bg-gray-950 opacity-80" />
      <div className="absolute z-10 w-80 border bg-white dark:bg-gray-950 dark:border-gray-700 opacity-100 rounded-md">
        {/* popup header */}
        <div className="flex justify-between border-b-[1px] dark:border-gray-700 p-4">
          <h2 className="text-2xl">登入</h2>
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={() => dispatch(setSignInPop(false))}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'xmark', style: 'solid' })}
              className="h-4 w-4 m-1 text-gray-900 dark:text-gray-100"
            />
          </button>
        </div>
        {/* popup body */}
        <div className="p-5">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}

export default SignInPopup