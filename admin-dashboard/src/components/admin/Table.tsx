import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Smile } from 'lucide-react';
import { Frown } from 'lucide-react';
import io from 'socket.io-client';
import AdminPieChart from './PieChart'

const socket = io('http://localhost:3000');


export function AdminTable() {
  const [comments, setComments] = useState<string[]>([]);
    const [data, setData] = useState<{name:string,value:number}[]>([]);

    useEffect(() => {
     const handleComments = (comments) => {

       setComments(JSON.parse(comments));
     };

     socket.on('messages', handleComments);

     return () => {
       socket.off('messages', handleComments);
     };
   }, []);

   useEffect(()=>{
     const d = [
       { name:"Positive",color:"#00C49F",value:comments.filter(c => c.value == "1").length},
      { name:"Negative",color:"#FF8042",value:comments.filter(c => c.value == "0").length}
    ];
    setData(d);
    console.log(d);
   },[comments])

  return (
    <>
    <div className="h-[300px] w-full">
      <AdminPieChart data={data} />
    </div>
    <Table>
      <TableCaption>A list of comments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Comment</TableHead>
          <TableHead className="font-bold">Class</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comments.map((comment,i) => (
          <TableRow key={i}>
            <TableCell className="truncate">{comment.comment}</TableCell>
            <TableCell className="truncate">{comment.value == "1" ? <div  className="flex gap-2 items-center"><Smile className="text-green-500" size="20" /> <span className="inline-flex items-center bg-slate-900  rounded-md px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Positive</span> </div> :   <div className="flex gap-2"><Frown className="text-yellow-500" size="20" /><span className="inline-flex items-center bg-slate-900 rounded-md px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Negative</span></div>}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell >Total</TableCell>
          <TableCell className="text-right">{comments.length}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex gap-2 items-center text-green-300"><Smile size="20" /> Postives</TableCell>
          <TableCell className="text-right">{comments.filter(comment => comment.value == "1").length}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="flex gap-2 items-center text-yellow-300"><Frown size="20" /> Negative</TableCell>
          <TableCell className="text-right">{comments.filter(comment => comment.value == "0").length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    </>
  )
}
