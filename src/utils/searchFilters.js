export function filterByCategory(products, selectedCategories) {
  if (!selectedCategories || selectedCategories.length === 0) return products
  return products.filter(product =>
    selectedCategories.includes(product.category)
  )
}

export function filterByPrice(products, minPrice, maxPrice) {
  return products.filter(p => {
    const price = parseFloat(p.price)
    return price >= (minPrice || 0) && price <= (maxPrice || Infinity)
  })
}

export function filterByText(products, searchTerm) {
  if (!searchTerm) return products
  const term = searchTerm.toLowerCase()
  return products.filter(p => p.name.toLowerCase().includes(term))
}

export function sortProducts(products, sortOption) {
  const sorted = [...products]
  switch (sortOption) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'recent':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    default:
      return products
  }
}

export function applyFilters(products, filters) {
  let result = [...products]
  result = filterByText(result, filters.text)
  result = filterByCategory(result, filters.categories)
  result = filterByPrice(result, filters.minPrice, filters.maxPrice)
  result = sortProducts(result, filters.sortBy)
  return result
}
