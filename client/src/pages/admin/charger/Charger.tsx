import { useEffect, useState,useCallback,useRef } from "react";
import { Link } from "react-router-dom";
import { getStationsPage } from "../../../utils/apis/admin/charger/adminChargerApis";
import toast from "react-hot-toast";
import axios from "axios";

type Station = {
    _id:string,
    stationId:string,
    stationName:string,
    createdAt:string,
    images:string[],
    chargers:[]
}[]

const Charger = () => {
    const [page,setPage] = useState(1)
    const [totalCount,setTotalCount] = useState(0)
    const [stations,setStations] = useState<Station>([])
    const deleteModal = useRef<HTMLDialogElement | null>(null);

    const totalPages = Math.ceil(totalCount/10)

    const fetchStations = useCallback(async()=>{
        try {
            const stationsData = await getStationsPage(page)
            if(stationsData.sucess && stationsData.data){
                setStations(stationsData.data)
                setTotalCount(stationsData.count)
            }else{
                toast('error in fetching stations')
                console.log(stationsData.error)
            }
        } catch (error) {
            console.log(error)
        }
    },[page])
    useEffect(()=>{
        fetchStations()
    },[fetchStations])

    const getAllTypes = (chargers:{portType:string}[])=>{
        if(chargers?.length>0){
            const types = new Set()
            chargers.forEach((charger)=>{
                types.add(charger.portType)
            })
            return [...types].join(',')
        }else{
            return 'not availabe'
        }
    }

    const [deleteStation,setDeleteStation] = useState({name:"",id:""})

    const handleDeleteModal=(id:string,name:string)=>{
        deleteModal.current?.showModal()
        setDeleteStation({name:name,id:id})
    }

    const handleDelete = async()=>{
        try {
            const result = await axios.delete('/api/admin/charger/delete-station',{
                data:{id:deleteStation.id}
            })
            if(result.data.deleted){
                deleteModal.current?.close()
                setDeleteStation({name:'',id:''})
                fetchStations()
                toast.success('station deleted')
            }else{
                toast.error('station not deleted')
            }
        } catch (error) {
            deleteModal.current?.close()
            setDeleteStation({name:'',id:''})
            fetchStations()
            console.log(error)
        }
    }

  return (
    <>
    <div>
      <div className="flex justify-end">
        <Link to='addcharger' className="btn btn-primary">Add station</Link>
      </div>
      <div className="overflow-x-auto min-h-120">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Station</th>
              <th>StationId</th>
              <th>Chargers</th>
              <th>Types</th>
              <th>Status</th>
              <th>Added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stations?.length>0?
            stations.map((station,index)=>{
            return(
                <tr key={station?.stationId}>
                <th>{index+1}</th>
                <td>
                    <div className="flex gap-1">
                        <img loading="lazy" className="aspect-square w-14 rounded-xl" src={station.images[0]} />
                        <p className="float-right">{station?.stationName}</p>
                    </div>
                </td>
                <td>{station.stationId}</td>
                <td>{station?.chargers.length}</td>
                <td>{getAllTypes(station?.chargers)}</td>
                <td>active</td>
                <td>{station?.createdAt.split('T')[0]}</td>
                <td className="flex gap-2">
                    <div className="tooltip tooltip-info" data-tip="edit">
                        <Link className="btn btn-accent" to={`edit/${station.stationId}`} state={{id:station._id}} >✏️</Link>
                    </div>
                    <div className="tooltip tooltip-warning" data-tip="delete">
                        <button className="btn bg-red-300 hover:bg-red-400" onClick={()=>handleDeleteModal(station._id,station.stationName)}>🗑️</button>
                    </div>
                </td>
                </tr>
            )
            })
            :null
            }
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-2">
        <div className="join">
            <button onClick={()=>setPage(pre=>pre-1)} disabled={page===1} className="join-item btn">«</button>
            <button className="join-item btn">Page {page} of {totalPages}</button>
            <button onClick={()=>setPage(pre=>pre+1)} disabled={page===totalPages} className="join-item btn">»</button>
        </div>
      </div>
    </div>
    <dialog ref={deleteModal} id="my_modal_3" className="modal">
        <div className="modal-box">
            <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Are you sure you want to delete the {deleteStation.name}</h3>
            <div className="modal-action">
                <button className="btn btn-warning" onClick={handleDelete}>Delete Station</button>
            </div>
        </div>
    </dialog>
    </>
  );
};

export default Charger;
