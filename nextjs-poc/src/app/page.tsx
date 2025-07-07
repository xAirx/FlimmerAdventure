'use client';

import { useTopStories } from '@/lib/hooks';
import { StoryCard } from '@/components/StoryCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function HomePage() {
  const { data: stories, isLoading, error, refetch } = useTopStories(20);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading the best stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message="We couldn't load the stories right now. Please try again!"
        onRetry={() => refetch()}
      />
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📰</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h2>
        <p className="text-gray-600">There are no stories to display at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Top Stories
        </h1>
        <p className="text-gray-600">
          The best {stories.length} stories from Hacker News, ranked by score
        </p>
      </div>

      {/* Stories List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-0">
            {stories.map((story, index) => (
              <StoryCard 
                key={story.id} 
                story={story} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Stories are updated regularly from{' '}
          <a 
            href="https://news.ycombinator.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-600 hover:text-orange-700 transition-colors duration-200"
          >
            Hacker News
          </a>
        </p>
      </div>
    </div>
  );
}
