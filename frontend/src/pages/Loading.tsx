const Loading: React.FC = () => {
  return (
    <div className="h-dvh flex items-center justify-center p-4 bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <div className="pulse text-sm">Initializing Workspace Session...</div>
      </div>
    </div>
  );
};

export default Loading;
