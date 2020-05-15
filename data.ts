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
  { id: '1', name: 'Tyler', email: 'tyler@hotmail.com', password: '123456' },
  { id: '2', name: 'Peter', email: 'peter@gmail.com', password: 'hsjhbsakjbnsa' },
  { id: '3', name: 'Lady Gaga', email: 'ladygaga@gmail.com', password: 'shallow123' },
]

export const posts: IPost[] = [
  { id: '1', title: 'Hello World', content: ':D', authorId: '2', createdAt: new Date(), updatedAt: new Date() }
]
