__Production checks:__

  - Remove browserify debug
  - re-enable uglify
  - remove git ignore build


__ToDo:__

 - cache scroll position for search on mobile 
 
 - scroll search input to top - mobile

 - Manage focus & state as a service





Flush build history:

git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch /posts /build /index.html -r' --prune-empty --tag-name-filter cat -- --all
