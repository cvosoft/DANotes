import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { query, where, orderBy, limit, deleteDoc, updateDoc, Firestore, collection, collectionData, doc, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  FavNotes: Note[] = [];


  unsubTrash;
  unsubNotes;
  unsubFavs;


  firestore: Firestore = inject(Firestore);

  constructor() {
    //this.items$ = collectionData(this.getNotesRef());

    this.unsubTrash = this.subTrashList();
    this.unsubNotes = this.subNotesList();
    this.unsubFavs = this.subFavsList();

  }

  async addNote(item: Note, collId: "notes" | "trash") {
    if (collId == "notes") {
      await addDoc(this.getNotesRef(), item).catch(
        (err) => { console.error(err) }
      ).then(
        (docRef) => {
          console.log("Doc written with id", docRef?.id);
        }
      )
    } else {
      await addDoc(this.getTrashRef(), item).catch(
        (err) => { console.error(err) }
      ).then(
        (docRef) => {
          console.log("Doc written with id", docRef?.id);
        }
      )
    }
  }

  async deleteNote(collId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(collId, docId)).catch(
      (err) => {
        console.log(err);
      }
    )
  }


  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getCollIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.error(err) }
      ).then();
    }
  }


  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }


  getCollIdFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes'
    } else {
      return 'trash'
    }
  }

  ngonDestroy() {
    this.unsubTrash();
    this.unsubNotes();
    this.unsubFavs();
  }


  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  subFavsList() {
    const q = query(this.getNotesRef(), where("marked", "==", true));
    return onSnapshot(q, (list) => {
      this.FavNotes = [];
      list.forEach(element => {
        this.FavNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  getTrashRef() {
    return collection(this.firestore, 'trash');
  }


  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getSingleDocRef(collId: string, docId: string) {
    return doc(collection(this.firestore, collId), docId)
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }



}
