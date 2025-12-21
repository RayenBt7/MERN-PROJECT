# TODO: Fix Home Page Architecture for Netflix-Style Layout

## Tasks

- [ ] Modify Home.jsx to render one MovieRow for all otherMovies titled "More Movies", removing categorized rows
- [ ] Update sidebar in Home.jsx to remove category links, keeping fixed items like Profile, Home, Settings, Logout
- [ ] Ensure MovieCard components have 16:9 aspect ratio, consistent width, and hover video preview (already implemented)
- [ ] Verify responsiveness and sidebar intact

## Notes

- Use MovieHero only for the first movie (heroMovie)
- Render remaining movies in one horizontal row using MovieCard
- Keep hover autoplay preview working for every MovieCard
- Do not change existing design style
- Do not remove sidebar
