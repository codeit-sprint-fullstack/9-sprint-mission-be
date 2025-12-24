export type Item =  {
    id: string,
    authorId: string,
    name: string,
    description: string,
    price: string,
    images: string[],
    createdAt: Date,
    updatedAt: Date,
    itemComment: ItemComment
}

export type ItemComment = {
    id: string;
    userId:  string;
    itemId: string;
    createdAt: Date;
    updatedAt: Date;
}

export  type OrderByType = "recent" | "oldest"