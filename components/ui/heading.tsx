interface HeadingProps {
    title: String;
    description: String;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}

export default Heading;