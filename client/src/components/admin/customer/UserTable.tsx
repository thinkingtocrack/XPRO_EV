import axios from "axios";
import { useRef, useState } from "react";
import { env } from "../../../main";


const UserTable = ({users,getUsers,page}) => {
  const blockRef= useRef(null)
  const unBlockRef= useRef(null)
  const [blockUser,setBlockUser] = useState({id:"",userName:"",block:false})
  const blockUserAction = async()=>{
    try {
      const result = await axios.patch(env.VITE_BASE_URL+"/api/admin/customer/blockuser",{
        id:blockUser.id,block:blockUser.block
      })
      if(blockUser.block){
        blockRef.current.click()
      }else{
        unBlockRef.current.click()
      }
      await getUsers(page)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    <div className="min-h-120 flex flex-col justify-between">
      <table className="table">    
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Name</th>
            <th>Status</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {users.map((element)=>{
          return(
          <tr key={element._id}>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <td>
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle h-12 w-12">
                    <img
                    loading="lazy"
                      src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                      alt="Avatar Tailwind CSS Component"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold">{element.userName}</div>
                  <div className="text-sm opacity-50">India</div>
                </div>
              </div>
            </td>
            <td>
              {element.isBlocked?'blocked':'Not Blocked'}
            </td>
            <td>{element.email}</td>
            <th>
              <button onClick={()=>{
                document.getElementById(element.isBlocked?'my_modal_2':'my_modal_1').showModal()
                setBlockUser({id:element._id,userName:element.userName,block:!element.isBlocked})
              }} className="btn btn-warning btn-sm">{element.isBlocked?"Unblock User":"Block User"}</button>
            </th>
          </tr>
          )
          })}
        </tbody>
      </table>
    </div>


    <dialog id="my_modal_1" className="modal">
      <div className="modal-box">
          <h3 className="font-bold text-lg text-red-400">Block {blockUser.userName} </h3>
          <p className="py-4">are you sure you want to block {blockUser.userName}</p>
          <div className="modal-action">
            <form method="dialog">
                <button ref={blockRef} className="btn">Close</button>
            </form>
            <button onClick={blockUserAction} className="btn btn-error">Block</button>
          </div>
      </div>
    </dialog>

    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
          <h3 className="font-bold text-lg text-red-400">UnBlock {blockUser.userName} </h3>
          <p className="py-4">are you sure you want to unblock {blockUser.userName}</p>
          <div className="modal-action">
            <form method="dialog">
                <button ref={unBlockRef} className="btn">Close</button>
            </form>
            <button onClick={blockUserAction} className="btn btn-error">UnBlock</button>
          </div>
      </div>
    </dialog>

    </>
  );
};

export default UserTable;
