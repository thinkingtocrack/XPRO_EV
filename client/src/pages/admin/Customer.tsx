import axios from 'axios'
import { useEffect, useState } from 'react'
import { env } from '../../main'
import UserTable from '../../components/admin/customer/UserTable'

const Customer = () => {
    const [users,setUsers]=useState([])
    const [filteredUsers,setFilteredUsers]=useState([])
    const [totalCount,setTotalCount]=useState(0)
    const [page,setPage] = useState(1)
    const [isActive,setIsActive] = useState('All')

    useEffect(()=>{
        getUsers(page)
    },[page])

    const totalPages = Math.ceil(totalCount/10)

    useEffect(()=>{
        if(isActive==='All'){
            setFilteredUsers(users)
        }else if(isActive==='Active' || isActive==='Blocked'){
            const newFilteredUsers = users.filter((user)=>isActive==='Active'?user?.isBlocked===false:user?.isBlocked===true)
            setFilteredUsers(newFilteredUsers)
        }
    },[isActive,users])

    const getUsers = async(page:number)=>{
        try {
            const userData = await axios.get(env.VITE_BASE_URL+"/api/admin/customer/getusers",{params:{page:page}})
            setUsers(userData.data.users)
            setTotalCount(userData.data.count)
        } catch (error) {
            console.log('error')
        }
    }

  return (
    <>
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
            <li><button onClick={()=>setIsActive('All')} className={isActive==='All'?'active':''}>All</button></li>
            <li><button onClick={()=>setIsActive('Active')} className={isActive==='Active'?'active':''}>Active</button></li>
            <li><button onClick={()=>setIsActive('Blocked')} className={isActive==='Blocked'?'active':''}>Blocked</button></li>
        </ul>
        <UserTable users={filteredUsers} getUsers={getUsers} page={page}/>
        <div className="flex justify-center">
            <div className="join">
                <button onClick={()=>setPage(pre=>pre-1)} disabled={page===1} className="join-item btn">«</button>
                <button className="join-item btn">Page {page} of {totalPages}</button>
                <button onClick={()=>setPage(pre=>pre+1)} disabled={page===totalPages} className="join-item btn">»</button>
            </div>
        </div>

    </>
  )
}

export default Customer