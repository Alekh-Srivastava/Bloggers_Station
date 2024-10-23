import React, { useEffect, useState } from 'react';
import appwriteService from '../appWrite/configure';
import { Container, PostCard } from '../index';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';

function Home() {
    const [posts, setPosts] = useState([]);
    const status = useSelector((state) => state.auth.status);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if(status)
        {
            setLoading(true);
            appwriteService.getPosts().then((posts) => {
                if (posts) {
                    setPosts(posts.documents);
                    setLoading(false)
                }else{
                    setLoading(false)
                }
            });
        }
    }, []);
    console.log(loading);
    
    if(loading)
    {
        return <Loading/>
    }
    if (status === false) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post) => (
                        <div key={post.$id} className="p-2">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Home;
