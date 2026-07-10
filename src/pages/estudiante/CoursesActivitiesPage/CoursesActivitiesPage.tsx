import { useCoursesActivities } from "./functions/useCoursesActivities";
import { KpiCards } from "./ui/KpiCards";
import { MyCoursesSection } from "./ui/MyCoursesSection";
import { NewCoursesSection } from "./ui/NewCoursesSection";
import { ActivitiesSection } from "./ui/ActivitiesSection";
import { ActivityDetailModal } from "./modals/ActivityDetailModal";

const TABS = [
    { key: "cursos", label: "Cursos" },
    { key: "nuevos", label: "Nuevos cursos" },
    { key: "actividades", label: "Actividades" },
] as const;

export function CoursesActivitiesPage() {
    const {
        tab, changeTab,
        myPage, setMyPage,
        myTopicFilter, setMyTopicFilter,
        myDateSort, setMyDateSort,
        myTopics, filteredMyCourses,
        newPage, setNewPage,
        newQuery, setNewQuery,
        newTeacherFilter, setNewTeacherFilter,
        newDateSort, setNewDateSort,
        newPriceSort, setNewPriceSort,
        newSpotsFilter, setNewSpotsFilter,
        newCourseTeachers, filteredNewCourses,
        activityQuery, setActivityQuery,
        activityStatusFilter, setActivityStatusFilter,
        setActivityPage,
        selectedActivity, setSelectedActivity,
        filteredActivities, pagedActivities,
        activityTotalPages, activityCurrentPage,
        doneCount, upcomingCount,
        openCourse,
    } = useCoursesActivities();

    return (
        <>
            {/* KPIs — siempre visibles */}
            <KpiCards doneCount={doneCount} upcomingCount={upcomingCount} />

            <div className="bg-edu-surface rounded-edu-card border border-edu-border-soft overflow-hidden">
                {/* Pestañas */}
                <div className="px-5 pt-3 border-b border-edu-border-soft">
                    <div className="flex gap-1">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => changeTab(t.key)}
                                className={`px-3.5 py-2.5 text-[0.8125rem] font-medium border-b-2 -mb-px transition-colors cursor-pointer bg-transparent ${tab === t.key
                                    ? "border-edu-primary text-edu-primary"
                                    : "border-transparent text-edu-ink-500 hover:text-edu-ink-700"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Cursos (los que participo) ── */}
                {tab === "cursos" && (
                    <MyCoursesSection
                        myTopics={myTopics}
                        myTopicFilter={myTopicFilter}
                        setMyTopicFilter={setMyTopicFilter}
                        myDateSort={myDateSort}
                        setMyDateSort={setMyDateSort}
                        filteredMyCourses={filteredMyCourses}
                        myPage={myPage}
                        setMyPage={setMyPage}
                        openCourse={openCourse}
                    />
                )}

                {/* ── Nuevos cursos (catálogo) ── */}
                {tab === "nuevos" && (
                    <NewCoursesSection
                        newQuery={newQuery}
                        setNewQuery={setNewQuery}
                        newTeacherFilter={newTeacherFilter}
                        setNewTeacherFilter={setNewTeacherFilter}
                        newCourseTeachers={newCourseTeachers}
                        newDateSort={newDateSort}
                        setNewDateSort={setNewDateSort}
                        newPriceSort={newPriceSort}
                        setNewPriceSort={setNewPriceSort}
                        newSpotsFilter={newSpotsFilter}
                        setNewSpotsFilter={setNewSpotsFilter}
                        filteredNewCourses={filteredNewCourses}
                        newPage={newPage}
                        setNewPage={setNewPage}
                        openCourse={openCourse}
                    />
                )}

                {/* ── Actividades ── */}
                {tab === "actividades" && (
                    <ActivitiesSection
                        activityQuery={activityQuery}
                        setActivityQuery={setActivityQuery}
                        activityStatusFilter={activityStatusFilter}
                        setActivityStatusFilter={setActivityStatusFilter}
                        setActivityPage={setActivityPage}
                        filteredActivities={filteredActivities}
                        pagedActivities={pagedActivities}
                        activityTotalPages={activityTotalPages}
                        activityCurrentPage={activityCurrentPage}
                        onSelectActivity={setSelectedActivity}
                    />
                )}
            </div>

            {/* Modal detalle de actividad */}
            {selectedActivity && (
                <ActivityDetailModal
                    activity={selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                />
            )}
        </>
    );
}
