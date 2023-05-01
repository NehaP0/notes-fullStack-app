
### Today's Agenda
Relationship implementation
Frontend (using React)
How to connect Frontend and Backend

### Tomorrow's Agenda
Deploy everything
API Documentation (Swagger)

### ----------------------------------------------------

Whenever you make api and a request, test it first, then code the next part.

if there are 2 users. Pulkit and aman.
Aman should not be able to read, delete or update the notes created by Pulkit and vice versa.

So i have to create a relation between users and notes collection. So than I can verify before any user reads/updates/deletes that is it the same user who created the note. 

User is independent collection and notes is dependent collection . Because if a user does not exist, notes will also not exist.
So put userid in notes schema as well.
One to many relationship. Coz one user can have many notes.

But before creating note, if I try to put userID manually, it will be very hectic, coz I want to search the userID in the database first, then put it.

Hence we will automate it.
But how? :-

### We know that jwt can also be used to transfer data.

What is connecting users and notes?
    ans- my auth middleware.
And I also know auth middleware is using jwt as well.

In jwt, Payload can be used to transfer data.

So transfer author id as payload while generating token.
(We are generating token while user login
like this :)
const token = jwt.sign({ course: 'backend' }, 'masai');
                            RANDOM PAYLOAD

This payload can be accessed in middleware in decoded.
console.log(decoded)
    { course: 'backend', iat: 1682921861 }
So pass author id as payload instead of passing some random payload.
In middleware, get access of author id and author name from decoded, and pass this author id and author name in req.body of notes. (I am manipulating req.body of notes from my middleware, because middleware is present in between request and response.)
So now I don't need to pass authorID and author Name manually everytime.

You'll notice that now the token is even longer, because now it carries authorID and authorName also.

Now while creating note, authorIS, and authorName will automatically get added.


While getting/updating/deletig a note, I'll take care that the operation of (getting/updating/deletig) is performed only on that note whose userID is matching.
i.e Only a user who that note belongs to should be able to do a particular operation on a note.

So while getting note I'll only get notes of that user who has logged in.
How to see which user has logged in?
Remember I passed the userID in notes req.body from middleware.
So use that autheID only to filterout the required notes.

While getting notes:
NoteModel.find({authorID : req.body.authorID})
So now if khunnu has logged in, I'll get only khunnu's notes.

While patching notes:
    const {noteID} = req.params
    const note = await NoteModel.findOne({_id : noteID})
   
        //if(author who has logged in !== author who is making the changes to note)
        if(req.body.authorID !== note.authorID){
            "DO NOT Allow making chnages"
        }
        else{
            Allow making chnages
        }

    i.e here we will take the noteid from req.params. And use that noteid to recognise which note is user trying to update.
    In that particular note, already an authorID will be present, because that note was already present in db.
    So that authorID inside note we will compare with the ID of user who has logged in.
    So the user who has logged in, his authorID is present in req.body.authorID coz we are passing it in middleware.
    and the authorID already present inside note can be accessed using 
    const {noteID} = req.params  //taking noteID from param
    const note = await NoteModel.findOne({_id : noteID}) //finding that particular note
    note.authorID  //taking out the authorID from it.


    llly do for delete


