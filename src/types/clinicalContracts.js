/**
 * @typedef {Object} ClinicalSurfaceTokenSet
 * @property {string} background
 * @property {string} elevatedBackground
 * @property {string} surface
 * @property {string} strongSurface
 * @property {string} text
 * @property {string} mutedText
 * @property {string} border
 * @property {string} focusRing
 * @property {string} clinicalAccent
 * @property {string} success
 * @property {string} warning
 * @property {string} danger
 */

/**
 * @typedef {Object} RouteVisualContract
 * @property {string} route
 * @property {string} viewport
 * @property {'dark'|'light'} theme
 * @property {'navbar-tabs-content-quickbar'|'navbar-content-bottom-actions'} expectedStickyStack
 * @property {'no-body-overflow'} overflowPolicy
 * @property {44} minTouchTarget
 */

/**
 * @typedef {Object} DiseaseExpertWorkflowMeta
 * @property {ClinicalActionHeader} actionHeader
 * @property {string[]} sourceIds
 * @property {string} lastCheckedAt
 * @property {string[]} linkedDrugs
 * @property {string[]} linkedTools
 * @property {string[]} linkedModels
 */

/**
 * @typedef {Object} ServiceCockpitState
 * @property {string} selectedTask
 * @property {string} selectedGroup
 * @property {string[]} activeRiskFilters
 * @property {'cards'|'table'|'decision-tree'} resultMode
 * @property {'closed'|'open'|'pinned'} mobileSheetState
 */

/**
 * @typedef {Object} SearchRetrievalResult
 * @property {'diagnosis'|'drug'|'surgery'|'calculator'|'redFlag'|'model3d'|'source'|'assistant'} resultGroup
 * @property {string} workflowIntent
 * @property {string} nextStep
 * @property {'routine'|'watch'|'urgent'} riskLevel
 * @property {string[]} linkedDrugs
 * @property {string[]} linkedTools
 * @property {string[]} linkedModels
 * @property {string[]} sourceIds
 */

/**
 * @typedef {Object} SafeClinicalMarkupProps
 * @property {string} html
 * @property {string[]} allowedTags
 * @property {string} sourceId
 * @property {string} fallbackText
 */

/**
 * @typedef {Object} ClinicalGovernanceMeta
 * @property {'quality-ready'|'needs-clinical-fill'} quality_status
 * @property {'A'|'B'|'C'} clinical_priority
 * @property {string} source_pack
 * @property {string} last_reviewed_at ISO date.
 * @property {number} freshness_sla_days
 * @property {string} freshness_due_at ISO date.
 * @property {'fresh'|'stale'} freshness_status
 * @property {string} review_owner
 * @property {string} senior_board_signoff_status
 * @property {string} source_last_checked_at ISO date for source registry freshness.
 * @property {string[]} source_registry_ids Machine-readable source registry IDs.
 * @property {boolean} clinical_action_ready True when the compact action header can be rendered.
 * @property {string} icd_coverage_status Canonical ICD coverage status for v14.
 * @property {'expert-ready'|'quality-ready'|'needs-board-review'} expert_ready_status
 * @property {boolean} drug_links_ready
 * @property {boolean} model3d_ready
 * @property {boolean} ai_index_ready
 */

/**
 * @typedef {Object} ClinicalWorkbenchShell
 * @property {'top nav -> Clinical OS -> contextual rail -> content -> bottom actions'} layoutContract
 * @property {string[]} routeFamilies
 * @property {'portrait'|'landscape'|'responsive'} iPhoneMode
 * @property {boolean} visualGateRequired
 * @property {boolean} safeAreaAware
 */

/**
 * @typedef {Object} DiseaseModalStackContract
 * @property {true} appNavHidden
 * @property {true} tabsFixedTop
 * @property {true} quickbarFixedBottom
 * @property {true} contentSafePadding
 * @property {true} railXScroll
 */

/**
 * @typedef {Object} ThemeQualityTokenSet
 * @property {string} background
 * @property {string} surface
 * @property {string} text
 * @property {string} mutedText
 * @property {string} border
 * @property {string} focus
 * @property {string} success
 * @property {string} warning
 * @property {string} danger
 * @property {string} clinicalAccent
 */

/**
 * @typedef {Object} ClinicalActionHeader
 * @property {string} excludeUrgent
 * @property {string} confirmWith
 * @property {string} firstStep
 * @property {string} referWhen
 * @property {string} monitoring
 * @property {string[]} sourceIds
 * @property {string} lastCheckedAt
 */

/**
 * @typedef {Object} DrugIntelligenceEntry
 * @property {string} inn
 * @property {string} name
 * @property {string[]} tradeNames
 * @property {string[]} aliases
 * @property {string} group
 * @property {string} className
 * @property {string} dose
 * @property {string} indications
 * @property {string} contraindications
 * @property {string} positivePharmacodynamics
 * @property {string} negativePharmacodynamics
 * @property {string} monitoring
 * @property {string[]} riskTags
 * @property {string} ckdAdjustment
 * @property {string} fertilityImpact
 * @property {string} interactions
 * @property {string[]} sourceIds
 * @property {string} lastReviewedAt
 * @property {string} clinicalTask Normalized clinical task for cockpit navigation.
 * @property {string} groupRu Russian group label for iPhone filter rails.
 * @property {string[]} routeLinks Related disease/calculator/atlas route IDs.
 * @property {'routine'|'watch'|'high'} monitoringPriority Monitoring urgency for clinician workflow.
 * @property {string[]} riskTagsNormalized v20 normalized risk tags for command filters.
 */

/**
 * @typedef {Object} DrugCockpitEntry
 * @property {string} clinicalTask
 * @property {string} group
 * @property {string} inn
 * @property {string} doseRange
 * @property {string[]} riskTagsNormalized
 * @property {string} monitoring
 * @property {string[]} routeLinks
 * @property {string[]} sourceIds
 */

/**
 * @typedef {Object} ClinicalPageShell
 * @property {'top nav -> section switch -> command/search -> contextual rail -> content -> bottom actions'} layoutContract
 * @property {string[]} routeFamilies
 * @property {'portrait'|'landscape'|'responsive'} iPhoneMode
 * @property {boolean} safeAreaAware
 * @property {boolean} horizontalOverflowBlocked
 */

/**
 * @typedef {Object} IcdCoverageMeta
 * @property {string} icd10_code
 * @property {'covered-core'|'needs-wave-expansion'|'planned'|'out-of-scope'} coverage_status
 * @property {string} canonical_route
 * @property {'data-module'|'registry-only'|'planned-module'} module_status
 * @property {'A'|'B'|'C'} clinical_priority
 * @property {string} source_pack
 */

/**
 * @typedef {Object} ClinicalTableBlock
 * @property {string[]} columns
 * @property {Array<Record<string, string>>} rows
 * @property {Record<string, string>} labels
 * @property {'responsive-table-or-card-row'} mobile_behavior
 * @property {string} next_step_hint
 * @property {'A'|'B'|'C'} priority
 */

/**
 * @typedef {Object} DecisionTreeNode
 * @property {string} id
 * @property {number} level
 * @property {string} title
 * @property {'normal'|'watch'|'alert'|'urgent'} status
 * @property {string} clinicalMeaning
 * @property {string[]} diagnostics
 * @property {string[]} treatment
 * @property {string} nextStep
 * @property {string} avoid
 * @property {string[]} sources
 */

/**
 * @typedef {Object} AnatomyHotspot
 * @property {string} id
 * @property {string} label
 * @property {string} clinicalMeaning
 */

/**
 * @typedef {Object} AnatomyModelMeta
 * @property {string} modelId
 * @property {'css-3d'|'webgl-lazy'|'svg-fallback'} modelType
 * @property {string} organ
 * @property {string} assetUrl
 * @property {string[]} diseaseIds
 * @property {AnatomyHotspot[]} hotspots
 * @property {string} fallbackAsset
 * @property {string} webglAsset
 * @property {string} performanceBudget
 * @property {'progressive-enhancement'|'fallback-only'} activationPolicy
 * @property {'static-fallback'|'reduced-animation'} reducedMotionBehavior
 */

/**
 * @typedef {Object} AtlasHotspot
 * @property {string} modelId
 * @property {string} hotspotId
 * @property {string} linkedDiseaseId
 * @property {string} linkedTab
 * @property {string} clinicalMeaning
 * @property {string} fallbackLabel
 */

/**
 * @typedef {Object} ClinicalLink
 * @property {'disease'|'drug'|'calculator'|'algorithm'|'redFlag'} targetType
 * @property {string} targetId
 * @property {string} label
 * @property {string} clinicalReason
 * @property {'A'|'B'|'C'} priority
 */

/**
 * @typedef {Object} ClinicalIndexDocument
 * @property {'disease'|'drug'|'calculator'|'algorithm'|'redFlag'|'model3d'|'source'} type
 * @property {string} id
 * @property {string} title
 * @property {string[]} aliases
 * @property {string} route
 * @property {'A'|'B'|'C'} clinicalPriority
 * @property {string[]} sourceIds
 * @property {number} searchBoost
 */

/**
 * @typedef {Object} ClinicalCommandDocument
 * @property {'disease'|'drug'|'calculator'|'surgery'|'model3d'|'redFlag'|'source'} type
 * @property {string} id
 * @property {string} title
 * @property {string[]} aliases
 * @property {string} route
 * @property {string[]} sourceIds
 * @property {'A'|'B'|'C'} priority
 * @property {string[]} redFlags
 * @property {string[]} linkedDrugs
 * @property {string[]} linkedCalculators
 * @property {string[]} linkedModels
 * @property {string} workflowIntent
 * @property {string} nextStep
 * @property {'routine'|'watch'|'urgent'} riskLevel
 * @property {string[]} linkedTools
 * @property {number} searchBoost
 */

/**
 * @typedef {Object} ClinicalCommandIndexDocument
 * @property {'disease'|'drug'|'calculator'|'surgery'|'model3d'|'redFlag'|'source'} type
 * @property {string} id
 * @property {string} title
 * @property {string[]} aliases
 * @property {string} route
 * @property {'A'|'B'|'C'} priority
 * @property {string[]} redFlags
 * @property {string[]} linkedDrugs
 * @property {string[]} linkedCalculators
 * @property {string[]} linkedModels
 * @property {string} workflowIntent
 * @property {string} nextStep
 * @property {'routine'|'watch'|'urgent'} riskLevel
 * @property {string[]} linkedTools
 * @property {string[]} sourceIds
 */

/**
 * @typedef {Object} ClinicalWorkflowBlock
 * @property {string} excludeUrgent
 * @property {string} confirmWith
 * @property {string} firstStep
 * @property {string} referWhen
 * @property {string} monitoring
 * @property {string[]} sources
 * @property {string} lastCheckedAt ISO date for v20 workflow freshness.
 */

/**
 * @typedef {Object} ClinicalToolResult
 * @property {number|string} score
 * @property {string} severity
 * @property {string} interpretation
 * @property {string} nextStep
 * @property {string[]} sourceIds
 * @property {true} localOnly
 */

/**
 * @typedef {Object} PremiumGateReport
 * @property {'pass'|'fail'} status
 * @property {string} updated_at
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} ui_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} content_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} clinical_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} deploy_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} discoverability_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} visual_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} drug_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} source_freshness_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} icd_coverage_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} iphone_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} drug_500_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} icd_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} encoding_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} model3d_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} ai_search_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} clinical_expert_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} security_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} a11y_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} performance_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} artifact_encoding_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} post_deploy_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} workflow_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} privacy_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} keyboard_a11y_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} encoding_user_facing_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v18_encoding_user_facing_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v18_iphone_modal_shell_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v18_service_shell_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v18_oncology_cards_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v18_smoke_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v19_clinical_workbench_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v19_iphone_15_17_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v19_drug_navigation_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v19_atlas_fallback_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v19_source_registry_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v19_artifact_encoding_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v20_clinical_os_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v20_iphone_15_17_interaction_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v20_expert_workflow_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v20_drug_cockpit_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v20_search_ai_safety_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v20_atlas_performance_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v20_visual_regression_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v20_source_freshness_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} workbench_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} disease_expert_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} drug_cockpit_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} icd_expansion_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} atlas_hotspot_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} ai_retrieval_safety_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} visual_consistency_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} visual_iphone_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} iphone_overlap_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} theme_symmetry_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} modal_stack_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} section_empty_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} deploy_freshness_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v23_iphone_geometry_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v23_theme_contrast_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v23_route_consistency_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v23_clinical_readability_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v23_service_cockpit_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v23_search_retrieval_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v23_atlas_interaction_gate
 * @property {{status: 'pass'|'fail', checks: Array<Record<string, unknown>>}} v23_deploy_freshness_gate
 */

export {};
