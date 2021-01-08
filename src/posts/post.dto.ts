import { IsString } from 'class-validator';

class CreatePost {
    @IsString()
    // The "!" syntax exists for those common-ish cases 
    // where you can't guarantee that the value will be defined immediately.
    public author!: string;

    @IsString()
    public content!: string;

    @IsString()
    public title!: string;
}

export default CreatePost;