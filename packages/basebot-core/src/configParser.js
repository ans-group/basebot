const env = process.env.NODE_ENV || 'development'

export const getAllModels = modules => {
  return Object.assign(modules.filter(module => module({}).models).map(module => module({}).models))
}

export const getAllModules = module => {
  const valid = module.filter(pkg => pkg && pkg[1] && (!pkg[1].env || !Array.isArray(pkg[1].env) || pkg[1].env.includes(env)).map(pkg => pkg[0]))
  return valid
}

export const getSingleModule = module => {
  if (!module || !Array.isArray(module)) return null
  return getvalue(module, 0)
}

function getvalue(packages, i) {
  const pkg = packages[i]
  if (!pkg || !Array.isArray(pkg)) return null
  const config = pkg[1] || {}
  if (
    !config.env ||
    !Array.isArray(config.env) ||
    config.env.includes(env)
  ) {
    return pkg[0]
  } else {
    return getvalue(modules, i + 1)
  }
}
