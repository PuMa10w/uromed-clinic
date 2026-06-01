# Product Telemetry Spec

## Goal
Turn search and symptom-first navigation into measurable product signals, not just UI interactions.

## Event Map

### `search`
Triggered after debounced disease search resolves in the navbar overlay.

Tracked fields:
- `event_category`: `search`
- `action`: raw query
- `event_label`: `<results_count> results`
- `value`: `results_count`
- `query_length`
- `results_count`
- `result_state`: `results` | `zero_results`

Primary uses:
- top search queries
- zero-result queries
- query length vs. success

### `search_select`
Triggered when the user picks a disease from search results.

Tracked fields:
- `event_category`: `search_select`
- `action`: source, currently `search`
- `event_label`: `<query> -> <target_id>`
- `query`
- `target_id`
- `source`
- `conversion_type`: `search_to_disease`

Primary uses:
- search-to-disease conversion
- best converting search intents
- most selected diseases from search

### `symptom_route`
Triggered when the user enters an andrology pathway from a complaint-first shortcut.

Tracked fields:
- `event_category`: `symptom_route`
- `action`: source, currently `search_overlay`
- `event_label`: `<complaint> -> <target_id>`
- `complaint`
- `target_id`
- `source`
- `conversion_type`: `complaint_to_pathway`

Primary uses:
- top complaints
- complaint-to-pathway conversion
- strongest symptom-entry routes

### `history_reopen`
Triggered when the user reopens a disease card from recent history.

Tracked fields:
- `event_category`: `history_reopen`
- `action`: `history_panel`
- `event_label`: `<previous_source> -> <target_id>`
- `value`: `open_count`
- `target_id`
- `previous_source`
- `open_count`
- `conversion_type`: `history_reopen`

Primary uses:
- repeat opens by original source
- which entry channels create lasting retention
- history-driven re-engagement

### `section_pathway`
Triggered when the user advances through a subsection-level pathway before the disease modal opens.

Tracked fields:
- `event_category`: `section_pathway`
- `action`: step, currently `focus_cta` | `subsection_card` | `disease_recommendation`
- `event_label`: `<section>/<subsection>` or `<section>/<subsection> -> <target_id>`
- `step`
- `section`
- `subsection`
- `target_id`
- `source`
- `retained`: `retained` | `default`
- `conversion_type`: `section_pathway_step`

Primary uses:
- subsection shell to disease conversion
- retained vs default pathway performance
- cluster-level dropoff before modal open

## Recommended GA Views

### Search Quality
Break down `search` by:
- `action`
- `results_count`
- `result_state`

Watch:
- highest-volume zero-result queries
- repeated short queries with poor conversion

### Search Conversion
Break down `search_select` by:
- `query`
- `target_id`
- `source`

Watch:
- queries that convert into disease views
- diseases with strongest search pull

### Complaint-First Demand
Break down `symptom_route` by:
- `complaint`
- `target_id`
- `source`

Watch:
- top complaints in andrology
- weak routes with clicks but poor downstream engagement

### Retention by Source
Break down `history_reopen` by:
- `previous_source`
- `target_id`
- `open_count`

Watch:
- which first-touch sources produce repeat opens
- which diseases are most often revisited
- whether symptom-first routes create stronger follow-up reading than generic search

### Section Pathway Funnel
Break down `section_pathway` by:
- `step`
- `section`
- `subsection`
- `source`
- `retained`
- `target_id`

Watch:
- which subsection shells actually progress into disease recommendations
- whether retained focus CTA outperforms plain subsection cards
- which recommendations lead to downstream `modal_open`

## Dev Snapshot
In non-production builds the app now keeps a lightweight local telemetry buffer and exposes it through the in-app `Debug Panel`.

The panel currently shows:
- total telemetry volume
- top subsection pathways
- top disease recommendations
- weakest dropoff points before modal open

Primary uses:
- fast local QA without waiting for GA dashboards
- checking whether a new pathway UX actually produces downstream modal opens
- debugging retained-vs-default section behavior during development

## Next Product Steps
1. Connect modal-open analytics to `target_id` so search and symptom routes can be matched to actual content opens.
2. Join `section_pathway` with `modal_open` on `target_id + source` to measure subsection-to-disease conversion.
3. Build a lightweight weekly report:
   - top complaints
   - top zero-result queries
   - top converting search terms
   - top retained sources
   - top converting subsection pathways
