package edu.amrita.timetable;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.TreeMap;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.PlanningVariable;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;

@PlanningEntity
public class Lecture
{
    public Integer id,Course,Parent=null;
    public List<Integer> Teacher,Section;
    public Integer TimeSlotSrcID;

    @PlanningVariable(valueRangeProviderRefs = {"RoomRange"})
    public Integer Room;
    @PlanningVariable(valueRangeProviderRefs = {"TimeRange"})
    public Integer TimeSlot;
    @PlanningVariable(valueRangeProviderRefs = {"DayRange"})
    public Integer Day;

    @ValueRangeProvider(id = "RoomRange")
    public List<Integer> RoomSrc;
    @ValueRangeProvider(id = "TimeRange")
    public List<Integer> TimeSlotSrc;
    @ValueRangeProvider(id = "DayRange")
    public List<Integer> DaySrc;

}
