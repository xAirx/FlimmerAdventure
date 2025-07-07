import Link from 'next/link';
import { Story } from '@/types/hackernews';
import { getDomainFromUrl, formatTimeAgo } from '@/lib/hackernews-api';

interface StoryCardProps {
  story: Story;
  index: number;
}

export const StoryCard = ({ story, index }: StoryCardProps) => {
  const domain = story.url ? getDomainFromUrl(story.url) : null;
  const timeAgo = formatTimeAgo(story.time);
  const commentsCount = story.descendants || 0;

  return (
    <div className="group border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
      <div className="flex items-start gap-4">
        {/* Story Rank */}
        <div className="flex-shrink-0 text-gray-400 font-mono text-sm font-medium w-6 text-right">
          {index + 1}.
        </div>

        {/* Story Content */}
        <div className="flex-1 min-w-0">
          {/* Title and URL */}
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight mb-1">
              {story.url ? (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  {story.title}
                </a>
              ) : (
                <Link
                  href={`/story/${story.id}`}
                  className="hover:text-orange-600 transition-colors duration-200"
                >
                  {story.title}
                </Link>
              )}
            </h2>
            {domain && (
              <span className="text-sm text-gray-500">
                ({domain})
              </span>
            )}
          </div>

          {/* Story Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium text-orange-600">{story.score}</span>
              <span>point{story.score !== 1 ? 's' : ''}</span>
            </div>
            
            <span className="text-gray-400">•</span>
            
            <Link
              href={`/story/${story.id}`}
              className="hover:text-orange-600 transition-colors duration-200"
            >
              by {story.by}
            </Link>
            
            <span className="text-gray-400">•</span>
            
            <span title={new Date(story.time * 1000).toLocaleString()}>
              {timeAgo}
            </span>
            
            <span className="text-gray-400">•</span>
            
            <Link
              href={`/story/${story.id}`}
              className="hover:text-orange-600 transition-colors duration-200"
            >
              {commentsCount} comment{commentsCount !== 1 ? 's' : ''}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 