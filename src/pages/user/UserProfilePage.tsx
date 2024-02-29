import React from 'react'
// --- components ---
import SideBar from 'components/SideBar';
// --- constants ---
import { SIDEBAR_FRAME, SIDEBAR_CONTAINER_FRAME } from 'constants/LayoutConstants';

function UserProfilePage() {
  return (
    <div className="flex justify-between">
      <div className={SIDEBAR_CONTAINER_FRAME}>
        <div className="max-w-[600px]">
          {/* Section1 大頭照/姓名/帳號/自介/追蹤&粉絲人數 */}
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage