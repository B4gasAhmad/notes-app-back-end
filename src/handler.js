const { nanoid } = require("nanoid");
const notes = require("./notes");

// create
const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    // id random
    const id = nanoid(16);

    // tanggal buat dan update
    const createAt = new Date().toISOString();
    const updateAt = createAt;

    // input ke dalam array notes
    const newNote = {
        id, title, tags, body, createAt, updateAt
    };

    notes.push(newNote);

    // ngecek newNote sudah masuk apa belum
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) { //jika berhasil!
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({ //jika gagal!
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
};

// menampilkan semua note
const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    }
});

// menampilkan detail notes
const getNoteByIdHandler = (request, h) => {
    // kita dapatkan idnya 
    const { id } = request.params;

    // filter idnya
    const note = notes.filter((n) => n.id === id)[0];

    // cek apakah object note bernilai undefined
    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    // jika undefined maka akan fail
    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    return response;
}

// Update
const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const {title, tags, body} = request.payload;
    const updateAt = new Date().toISOString;

    const index = notes.findIndex((note)=> note.id === id);

    if(index !== -1){
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updateAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui'
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan'
    });
    response.code(404);
    return response;
}

// Delete
const deleteNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    
    const index = notes.findIndex((note)=> note.id === id);

    if(index !== -1){
        notes.splice(index,1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(400);
    return response;
}

module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };