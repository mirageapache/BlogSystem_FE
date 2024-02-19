import React from 'react';

function FollowBtn(props: { state: number}) {
  //state為追蹤狀態 [0-未追蹤 / 1-追蹤(不主動推播) / 2-主動推播]
  const { state } = props;

  return (
    <div>
      { state === 0?
        <button type="button" className="font-bold hover:text-orange-500">
          追蹤
        </button>
      :
        <button type="button" className="font-bold hover:text-orange-500">
          取消追蹤
        </button>
      }
      
    </div>
  );


}

export default FollowBtn;
