export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface IPost {
  id: string;
  authorId: IUser['id'];
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const users: IUser[] = [
  { id: '1', name: 'Lady Gaga', email: 'ladygaga@gmail.com', password: 'shallow123' },
  { id: '2', name: 'Gilbert Bryant', email: 'gilbert.bryant@example.com', password: 'deejay' },
  { id: '3', name: 'Tyler', email: 'tyler@hotmail.com', password: 'mrrobot_fsociety' },
]

export const posts: IPost[] = [
  { id: '1', title: 'Hello World!', content: 'lorem ipsum dolor sit amet', authorId: '2', createdAt: new Date(), updatedAt: new Date() }
]
