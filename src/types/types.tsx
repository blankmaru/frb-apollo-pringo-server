export type User = {
    id: string;
    name: string;
    image: string;
    posts: Array<Post>
}

export type Post = {
    id: string;
    user: User,
    postImg: string,
    likesCount: Array<User>,
    comments: Array<Comment>,
    description: string,
    postedAt: any
}

export type TComment = {
    user: User,
    text: string
}