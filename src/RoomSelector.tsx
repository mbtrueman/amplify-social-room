/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Schema } from "../amplify/data/resource"
import { defaultRoom } from "./utils";
import { useEffect, useState } from "react";
import { type Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

export function RoomSelector({
  currentRoomId,
  onRoomChange
}: {
  currentRoomId: string,
  onRoomChange: (roomId: string) => void
}) {

  const [rooms, setRooms] = useState<Schema["Room"]["type"][]>([defaultRoom]);
  const [client, setClient] = useState<any>();
  
  useEffect(() => {
    // Add observeQuery code here
    const _client = generateClient<Schema>();
    // console.log('client:', client);
    const sub = _client.models.Room.observeQuery().subscribe({
      next: (data) => {
        setRooms([defaultRoom, ...data.items])
      }
    });

    setClient(_client);
    return () => sub.unsubscribe()
  }, []);

  console.log(rooms);
  return <>
    <select
      onChange={e => onRoomChange(e.target.value)}
      value={currentRoomId}>
      {rooms.map(room => <option value={room.id} key={room.id}>{room.topic}</option>)}
    </select>
    <button onClick={async () => {
      const newRoomName = window.prompt("Room name")
      if (!newRoomName) {
        return
      }
      const { data: room } = await client.models.Room.create({
        topic: newRoomName
      })
      
      if (room !== null) {
        onRoomChange(room.id)
      }
    }}>[+ add]</button>
  </>
}