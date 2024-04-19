import { isEmpty } from 'lodash';

function BasicErrorPanel(props: {errorMsg: string | undefined}) {
  const { errorMsg } = props;

  return (
    <div className="flex justify-center mt-10">
      <p className="text-3xl">{!isEmpty(errorMsg) ? errorMsg : '發生一些錯誤，請稍後再試!!'}</p>
    </div>
  )
}

export default BasicErrorPanel