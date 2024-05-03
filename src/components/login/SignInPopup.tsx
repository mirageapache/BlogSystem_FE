import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { connect, useDispatch } from 'react-redux';
import { reduxForm, change, getFormValues, FormState } from 'redux-form';
// --- components ---
import SignInForm from './SignInForm';
// --- functions / types ---
import { setSignInPop } from '../../redux/loginSlice';

const mapStateToProps = (state: FormState) => ({
  formValues: getFormValues('signin')(state),
});

function SignInPopup(props: any) {
  const { dispatch } = props;
  const sliceDispatch = useDispatch();

  /** 關閉登入Popup */
  const handleClose = () => {
    dispatch(change('signin', 'account', ''));
    dispatch(change('signin', 'password', ''));
    sliceDispatch(setSignInPop(false));
  };

  return (
    <div className="fixed w-full h-full z-30 flex justify-center items-center select-none">
      <button
        type="button"
        className="fixed w-full h-full bg-gray-950 opacity-80"
        onClick={handleClose}
      >
        <p className="hidden">p</p>
      </button>
      <div className="absolute z-10 w-full min-[320px]:w-11/12 max-w-[400px] border bg-white dark:bg-gray-950 dark:border-gray-700 opacity-100 rounded-md">
        {/* popup header */}
        <div className="flex justify-between border-b-[1px] dark:border-gray-700 p-4">
          <h2 className="text-2xl text-orange-500 font-semibold">歡迎回來</h2>
          <button
            aria-label="close"
            type="button"
            className="flex jsutify-center m-1"
            onClick={handleClose}
          >
            <FontAwesomeIcon
              icon={icon({ name: 'xmark', style: 'solid' })}
              className="w-5 h-5 m-1 text-gray-700 dark:text-gray-400"
            />
          </button>
        </div>
        {/* popup body */}
        <div className="pt-4 pb-8 px-6 flex justify-center items-center">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(
  reduxForm({
    form: 'signin',
  })(SignInPopup)
);
