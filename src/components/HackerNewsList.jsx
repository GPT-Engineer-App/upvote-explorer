import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StoryCard from './StoryCard';
import SearchBar from './SearchBar';
import { Skeleton } from '@/components/ui/skeleton';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const HackerNewsList = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Hacker News Top Stories</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(9)].map((_, index) => (
            <Skeleton key={index} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredStories.map(story => (
            <StoryCard key={story.objectID} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HackerNewsList;