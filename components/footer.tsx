
export default function Footer() {
  
  return (
    <footer className="border-t py-12 mt-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-sm font-mono text-muted-foreground">
            © {new Date().getFullYear()} Sofia Ferro. Made with love using v0 🖤. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
