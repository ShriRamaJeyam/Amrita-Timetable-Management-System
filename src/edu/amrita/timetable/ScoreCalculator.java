package edu.amrita.timetable;
import java.util.*;

import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.impl.score.director.easy.EasyScoreCalculator;
public class ScoreCalculator implements EasyScoreCalculator<Solver> 
{
	 @Override
	 public HardSoftScore calculateScore(Solver TimeTable) 
	 {
		 Integer hard=0,soft=0;
		 List<Lecture> lst = TimeTable.leclst;
		 Map<Integer,Lecture> LectureMap = new TreeMap<Integer, Lecture>();
		 Map<Integer,Map<Integer,List<Lecture> > > SectionLectures = new TreeMap<Integer,Map<Integer,List<Lecture> > >();
		 Map<Integer,Map<Integer,List<Lecture> > > TeacherLectures = new TreeMap<Integer,Map<Integer,List<Lecture> > >();
		 Map<Integer,Map<Integer,List<Lecture> > > RoomLectures = new TreeMap<Integer,Map<Integer,List<Lecture> > >();

		 //Preprocessing
		 {
			for(Lecture l: lst)
			{
				LectureMap.put(l.id,l);

				// Section
				if( l.Parent == null )
				for(Integer i:l.Section)
				{
					if(!SectionLectures.containsKey(i))
					{
						SectionLectures.put(i,new TreeMap<Integer,List<Lecture>>());
					}

					Map<Integer, List<Lecture> > section = SectionLectures.get(i);

					if(!section.containsKey(l.Day))
					{
						section.put(l.Day,new ArrayList<Lecture>());
					}

					section.get(l.Day).add(l);
				}

				//Teachers
				if( l.Teacher.get(0) != 0 || l.Teacher.size() != 1 )
				for(Integer i:l.Teacher)
				{
					if(i != 0)
					{
						if(!TeacherLectures.containsKey(i))
						{
							TeacherLectures.put(i,new TreeMap<Integer,List<Lecture>>());
						}

						Map<Integer, List<Lecture> > teacher = TeacherLectures.get(i);

						if(!teacher.containsKey(l.Day))
						{
							teacher.put(l.Day,new ArrayList<Lecture>());
						}
						teacher.get(l.Day).add(l);
					}

				}
				if(l.Room != 0)
				{
					if (!TeacherLectures.containsKey(l.Room))
					{
						SectionLectures.put(l.Room, new TreeMap<Integer, List<Lecture>>());
					}

					Map<Integer, List<Lecture>> room = SectionLectures.get(l.Room);

					if (!room.containsKey(l.Day)) {
						room.put(l.Day, new ArrayList<Lecture>());
					}

					room.get(l.Day).add(l);
				}

			}
		 }

		 for(Map.Entry<Integer,Map<Integer,List<Lecture> > > section:SectionLectures.entrySet())
		 {
		 	int LateLunchDays = 0;
			for(Map.Entry<Integer,List<Lecture> > day : section.getValue().entrySet())
			{
				boolean lateLunch = false,lunchComp = true;
				List<Lecture> LecLst = day.getValue();
				for(Lecture first : LecLst)
				{
					if(MapClass.foodConflict.contains(first.TimeSlot))
					{
						lateLunch = true;
					}
					if(MapClass.foodCompConflict.contains(first.TimeSlot))
					{
						lunchComp = false;
					}
					for(Lecture second : LecLst)
					{
						if(first != second)
						{
							if(MapClass.TimeSlotConflict.get(first.TimeSlot).contains(second.TimeSlot))
							{
								PenaltyConstants.OVERLAP.SubstractScore(hard,soft);
							}
							if(MapClass.TimeSlotConflict.get(0 - first.TimeSlot).contains(second.TimeSlot) && (!MapClass.RoomRegionMap.get(first.Room).equals(MapClass.RoomRegionMap.get(second.Room))))
							{
								PenaltyConstants.REGION_GAP.SubstractScore(hard,soft);
							}
							if(first.Course.equals(second.Course))
							{
								if(first.TimeSlotSrcID == second.TimeSlotSrcID)
								{
									PenaltyConstants.NO_REPEAT_SAME_SLOT.SubstractScore(hard,soft);
								}
								else
								{
									PenaltyConstants.NO_REPEAT_DIFF_SLOT.SubstractScore(hard,soft);
								}
							}
						}
					}
				}
				if(lateLunch)
				{
					LateLunchDays += 1;
					if(!lunchComp)
					{
						PenaltyConstants.NO_LUNCH_COMP.SubstractScore(hard,soft);
					}
				}

			}
			if(LateLunchDays > 1)
			{
				PenaltyConstants.MANY_DAY_NOLUNCH.SubstractScore(hard,soft);
			}
		 }
		 for(Map.Entry<Integer,Map<Integer,List<Lecture> > > teacher:TeacherLectures.entrySet())
		 {
			 int LateLunchDays = 0;
			 for(Map.Entry<Integer,List<Lecture> > day : teacher.getValue().entrySet())
			 {
				 boolean lateLunch = false,lunchComp = true;
				 List<Lecture> LecLst = day.getValue();
				 for(Lecture first : LecLst)
				 {
					 for(Lecture second : LecLst)
					 {
						 if(MapClass.foodConflict.contains(first.TimeSlot))
						 {
							 lateLunch = true;
						 }
						 if(MapClass.foodCompConflict.contains(first.TimeSlot))
						 {
							 lunchComp = false;
						 }
						 if(first != second)
						 {
							 if(MapClass.TimeSlotConflict.get(first.TimeSlot).contains(second.TimeSlot))
							 {
								 PenaltyConstants.OVERLAP.SubstractScore(hard,soft);
							 }
							 if(MapClass.TimeSlotConflict.get((-1) - first.TimeSlot).contains(second.TimeSlot))
							 {
								 PenaltyConstants.REGION_GAP.SubstractScore(hard,soft);
							 }
						 }
					 }
				 }
				 if(lateLunch)
				 {
					 LateLunchDays += 1;
					 if(!lunchComp)
					 {
						 PenaltyConstants.NO_LUNCH_COMP.SubstractScore(hard,soft);
					 }
				 }
			 }
			 if(LateLunchDays > 1)
			 {
				 PenaltyConstants.MANY_DAY_NOLUNCH.SubstractScore(hard,soft);
			 }
		 }
		 for(Map.Entry<Integer,Map<Integer,List<Lecture> > > room:RoomLectures.entrySet())
		 {
			 for(Map.Entry<Integer,List<Lecture> > day : room.getValue().entrySet())
			 {
				 List<Lecture> LecLst = day.getValue();
				 for(Lecture first : LecLst)
				 {
					 for(Lecture second : LecLst)
					 {
						 if(first != second)
						 {
							 if(MapClass.TimeSlotConflict.get(first.TimeSlot).contains(second.TimeSlot))
							 {
								 PenaltyConstants.OVERLAP.SubstractScore(hard,soft);
							 }
						 }
					 }
				 }
			 }
		 }
		 soft -= 50 * RoomLectures.size();
		 MapClass.bfr--;
		 if(MapClass.bfr==0)
		 {
			 MapClass.bfr=1000;
			 System.out.println("{"+hard+","+soft+"}");
		 }
		 return HardSoftScore.of(hard, soft);
	 }
}
