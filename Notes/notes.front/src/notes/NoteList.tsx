import { useRef, useEffect, useState } from 'react';
import type { FC, ReactElement } from 'react';
import { Client } from '../api/api'; 
import type { CreateNoteDto, NoteLookupDto } from '../api/api';
import { FormControl } from 'react-bootstrap';

const apiClient = new Client('https://localhost:7228');

const createNote = (note: CreateNoteDto) => apiClient.create('1.0', note);

const NoteList = (): ReactElement => {
    let textInput = useRef(null);
    const [notes, setNotes] = useState<NoteLookupDto[] | undefined>(undefined);

    async function getNotes(){
        const noteListVm = await apiClient.getAll('1.0');
        setNotes(noteListVm.notes);
    };

    useEffect(()=> {
        getNotes();
    }, []);

    const handleKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
        const note: CreateNoteDto = {
            title: event.currentTarget.value,
        };
        try {
            event.currentTarget.value = '';
            await createNote(note);
            getNotes();
            
        } catch (error) {
            console.log('ERROR:', error);
            
        }
        }
    };
    return (
        <div>
            Notes
            <div>
                <FormControl ref={textInput} onKeyPress={handleKeyPress} />
            </div>
            <div>
                {notes?.map((note, index)=> (
                    <div key={`${index}-${note.title}`}>{note.title}</div>
                ))}
            </div>
        </div>
    );
};
export default NoteList;

