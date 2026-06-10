import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Bookmark, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

import JobCard from '../components/jobs/JobCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
import { clearSaved } from '../redux/savedJobsSlice.js';

export default function SavedJobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saved = useSelector((s) => s.savedJobs.items);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            <Bookmark size={24} className="text-brand-600" /> Saved Jobs
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {saved.length === 0
              ? 'Save jobs to revisit them later'
              : `${saved.length} job${saved.length === 1 ? '' : 's'} bookmarked for later`}
          </p>
        </div>
        {saved.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => {
              dispatch(clearSaved());
              toast.success('All saved jobs cleared');
            }}
          >
            <Trash2 size={16} /> Clear all
          </Button>
        )}
      </div>

      {saved.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs yet"
          description="Tap the bookmark icon on any job to save it for later."
          action={
            <Button onClick={() => navigate('/jobs')}>
              <Briefcase size={16} /> Browse Jobs
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
