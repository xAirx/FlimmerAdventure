'use client';

import { useParams } from 'next/navigation';
import { useStory, useUser } from '@/lib/hooks';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import Link from 'next/link';
import { getDomainFromUrl, formatTimeAgo } from '@/lib/hackernews-api';

export default function StoryDetailPage() {
  const params = useParams();
  const idParam = params?.id;
  const id = typeof idParam === 'string' ? parseInt(idParam, 10) : Array.isArray(idParam) ? parseInt(idParam[0], 10) : NaN;

  const { data: story, isLoading, error, refetch } = useStory(id);
  const { data: author } = useUser(story?.by ?? '');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading story...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <ErrorMessage 
        message="We couldn't load the story. Please try again!"
        onRetry={() => refetch()}
      />
    );
  }

  const domain = story.url ? getDomainFromUrl(story.url) : null;
  const timeAgo = formatTimeAgo(story.time);

  return (
    <div className="space-y-6">
      {/* Story Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {story.url ? (
            <a href={story.url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors duration-200">
              {story.title}
            </a>
          ) : (
            story.title
          )}
        </h1>
        {domain && (
          <p className="text-sm text-gray-500 mb-4">({domain})</p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span className="font-medium text-orange-600">{story.score} point{story.score !== 1 ? 's' : ''}</span>
          <span className="text-gray-400">•</span>
          <span>{timeAgo}</span>
          <span className="text-gray-400">•</span>
          <span>{story.descendants || 0} comment{(story.descendants || 0) !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Author Info */}
      {author && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h2>
          <p className="text-sm text-gray-700 mb-1">Username: <span className="font-medium">{author.id}</span></p>
          <p className="text-sm text-gray-700 mb-1">Karma: <span className="font-medium">{author.karma}</span></p>
          <p className="text-sm text-gray-700">Joined: <span className="font-medium">{new Date(author.created * 1000).toLocaleDateString()}</span></p>
        </div>
      )}

      {/* Back Link */}
      <div>
        <Link href="/" className="text-orange-600 hover:text-orange-700 transition-colors duration-200">← Back to Top Stories</Link>
      </div>
    </div>
  );
} 