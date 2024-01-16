import { Link } from 'react-router-dom';

function PostTag(props: { text: string }) {
  const { text } = props;
  return (
    <span className="mr-3">
      <a href="/" className="font-bold">
        {text.toUpperCase()}
      </a>
    </span>
  );
}

interface PostType {
  id: number;
  title: string;
  tags: string[];
  body: string;
}

function PostItem({ id, title, body, tags }: PostType) {
  const tagsList = tags.map((tag) => <PostTag key={`${tag}-${id}`} text={tag} />);

  return (
    <div className="text-left mb-4 border-b-[1px] dark:border-gray-700 pb-4">
      <div className="text-gray-600 dark:text-gray-300 my-1">Augest 5, 2023</div>
      <h2 className="font-semibold text-2xl xl:text-3xl">
        <Link to={`/post/${id}`}>{title}</Link>
      </h2>
      <div className="text-orange-500">{tagsList}</div>
      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{body}</p>
    </div>
  );
}

export default PostItem;