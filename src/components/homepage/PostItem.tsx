function PostTag(props: { text: string; href: string }) {
  const { text, href } = props;
  return <a href={href}>{text} </a>;
}

function PostItem() {
  return (
    <div className="text-left mb-4 border-b-[1px] dark:border-gray-700 pb-4">
      <div className="text-gray-600 dark:text-gray-300 my-1">Augest 5, 2023</div>
      <h2 className="font-semibold text-2xl xl:text-3xl">
        <a href="/">title</a>
      </h2>
      <div className="text-orange-500">
        <PostTag text="NEXTJS" href="/" />
        <PostTag text="REACT" href="/" />
        <PostTag text="TAILWIND" href="/" />
      </div>
      <p className="text-gray-600 dark:text-gray-300">this is content, this is content</p>
    </div>
  );
}

export default PostItem;
